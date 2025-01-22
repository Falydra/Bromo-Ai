<?php

namespace App\Services;

use App\Jobs\ProcessArticles;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class DOAJService {
    protected $baseUrl;
    protected $pythonServer;
    protected $apiKey;
    protected $outputPath;

    public function __construct() {
        $this->baseUrl = env('DOAJ_API_URL');
        $this->apiKey = env('DOAJ_API_KEY');
        $this->outputPath = 'app/temp'; // for permanent storage, use 'app/json'
        $this->pythonServer = env('PYTHON_MODEL_URL');
    }

    public function extractData($data) {
        $extractedData = [];

        foreach ($data['results'] as $article) {
            $bibjson = $article['bibjson'] ?? [];
            $doi = Arr::first($bibjson['identifier'], function ($identifier) {
                return $identifier['type'] == 'doi';
            }) ?? [];

            if (!empty($doi)) {
                $extractedData[] = [
                    // 'identifiers' => $bibjson['identifier'] ?? [],
                    'doi' => $doi['id'] ?? [],
                    'links' => Arr::first(array_map(fn($link) => $link['url'] ?? '', $bibjson['link'] ?? [])),
                    'abstract' => $bibjson['abstract'] ?? '',
                    'title' => $bibjson['title'] ?? '',
                    'authors' => array_map(fn($author) => $author['name'] ?? '', $bibjson['author'] ?? []),
                    'year' => $bibjson['year'] ?? '',
                ];
            }
        }

        // save to new json
        $outputPath = base_path("{$this->outputPath}/article_data.json");

        // check directory and the json exists before writing new file
        if (!File::exists(dirname($outputPath))) {
            File::makeDirectory(dirname($outputPath), 0755, true);
        }

        File::put($outputPath, json_encode($extractedData, JSON_PRETTY_PRINT)); // debug purposes

        return $extractedData;
    }

    public function searchArticle($searchQuery, $pageSize=10, $page=1, $pageAmount=1) {
        $keywords = Str::of($searchQuery)->explode("; ");
        $query = '(' . $keywords->map(fn($word) => "bibjson.\*:\"$word\"")->join(' OR ') . ')';
        $query = "{$query} AND bibjson.link.url:\".pdf\"";

        for ($i=$page; $i<$page+$pageAmount; $i++) {
            ProcessArticles::dispatch($query, $pageSize, $i)->delay(now()->addSeconds(5));
        }

        $response = Http::get(
            "{$this->baseUrl}/search/articles/{$query}",
            ["pageSize" => $pageSize],
        );

        if ($response->successful()) {
            $extractedData = $this->extractData($response->json());
            return $extractedData;
        }

        return response()->json([
            "error" => "internal server error"
        ], 500);
    }
}
