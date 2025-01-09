<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DOAJService {
    protected $baseUrl;
    protected $apiKey;

    public function __construct() {
        $this->baseUrl = env('DOAJ_API_URL');
        $this->apiKey = env('DOAJ_API_KEY');
    }

    public function getArticle($id) {
        $response = Http::get("{$this->baseUrl}/articles/{$id}");

        if ($response->successfull()) {
            return $response->json();
        }

        return null;
    }

    public function searchArticle($search_query) {
        $response = Http::get("{$this->baseUrl}/search/articles/{$search_query}");

        if ($response->successful()) {
            return $response->json();
        }

        return null;
    }

    public function getJournal($id) {
        $response = Http::get("{$this->baseUrl}/journals/{$id}");

        if ($response->successful()) {
            return $response->json();
        }

        return null;
    }

    public function searchJournal($search_query) {
        $response = Http::get("{$this->baseUrl}/search/journals/{$search_query}");

        if ($response->successful()) {
            return $response->json();
        }

        return null;
    }
}
