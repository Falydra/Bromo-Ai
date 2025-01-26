<?php

namespace App\Jobs;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessArticles implements ShouldQueue {
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    public $timeout = 600;

    protected $pythonServer;
    protected $baseUrl;
    protected $query;
    protected $pageSize;
    protected $page;

    /**
     * Create a new job instance.
     */
    public function __construct($query, $pageSize, $page) {
        $this->pythonServer = env('PYTHON_MODEL_URL');
        $this->baseUrl = env('DOAJ_API_URL');
        $this->query = $query;
        $this->pageSize = $pageSize;
        $this->page = $page;
    }

    /**
     * Execute the job.
     */
    public function handle(): void {
        $response = Http::get(
            "{$this->baseUrl}/search/articles/{$this->query}",
            ["pageSize" => $this->pageSize, "page" => $this->page]
        );

        if ($response->successful()) {
            $extractedData = $this->extractData($response->json());

            $download = Http::timeout(600)
            ->withHeaders([
                "Content-Type" => "application/json",
            ])->post(
                "{$this->pythonServer}/download", [
                    "articleData" => $extractedData,
                    "pageSize" => $this->pageSize,
                    "page" => $this->page,
                    "title" => "{$this->query}",
                ]
            );
        }
    }

    public function extractData($data) {
        $extractedData = [];

        foreach ($data["results"] as $article) {
            $bibjson = $article["bibjson"] ?? [];
            $doi = Arr:: first($bibjson["identifier"], function ($identifier) {
                return $identifier["type"] == "doi";
            }) ?? [];

            if (!empty($doi)) {
                $extractedData[] = [
                    "doi" => $doi["id"] ?? [],
                    "links" => Arr::first(array_map(fn($link) => $link["url"] ?? "", $bibjson["link"] ?? [])),
                    "abstract" => $bibjson["abstract"] ?? "",
                    "title" => $bibjson["title"] ?? "",
                    "authors" => array_map(fn($author) => $author["name"] ?? "", $bibjson["author"] ?? []),
                    "year" => $bibjson["year"] ?? "",
                ];
            }
        }

        return $extractedData;
    }
}
