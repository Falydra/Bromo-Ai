<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class DOAJService {
    protected $baseUrl;
    protected $apiKey;
    protected $outputPath;

    public function __construct() {
        $this->baseUrl = env('DOAJ_API_URL');
        $this->apiKey = env('DOAJ_API_KEY');
        // $this->outputPath = 'app/temp'; // for permanent storage, use 'app/json'
        $this->outputPath = 'scripts';
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
        // $outputPath = storage_path("{$this->outputPath}/article_data.json");
        $outputPath = base_path("{$this->outputPath}/article_data.json");

        // check directory and the json exists before writing new file
        if (!File::exists(dirname($outputPath))) {
            File::makeDirectory(dirname($outputPath), 0755, true);
        }

        File::put($outputPath, json_encode($extractedData, JSON_PRETTY_PRINT));

        return response()->json([
            'success' => 'true',
            'message' => 'Data extracted successfully',
            'file' => $outputPath,
        ]);
    }

    public function searchArticle($search_query, $pageSize=50, $page=1) {
        $keywords = Str::of($search_query)->explode("; ");
        $query = '(' . $keywords->map(fn($word) => "bibjson.\*:\"$word\"")->join(' OR ') . ')';
        $query = "{$query} AND bibjson.link.url:\".pdf\"";
        // $query = "{$query} AND bibjson.link.url:\"ejournal.undip.ac.id\"";

        $response = Http::get(
            "{$this->baseUrl}/search/articles/{$query}",
            ["pageSize" => $pageSize, "page" => $page]
        );

        if ($response->successful()) {
            return $this->extractData($response->json());
        }

        return null;
    }

    public function searchJournal($search_query, $pageSize=5) {
        $response = Http::get(
            "{$this->baseUrl}/search/journals/{$search_query}",
            ["pageSize" => $pageSize],
        );

        if ($response->successful()) {
            return $response->json();
        }

        return null;
    }
}
