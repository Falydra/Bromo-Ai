<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessArticles;
use Illuminate\Http\Request;
use App\Services\DOAJService;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;

class ArticleController extends Controller {
    protected $doajService;
    protected $pythonServer;

    public function __construct(DOAJService $doajService) {
        $this->doajService = $doajService;
        $this->pythonServer = env('PYTHON_MODEL_URL');
    }

    public function searchArticle(Request $request) {
        $query = $request->input('query');
        $page = $request->input('page');

        $articles = $this->doajService->searchArticle($query, 10, 1, 10);

        if ($articles) {
            return $articles;
        }

        return response()->json([
            'error' => 'articles not found',
        ], 404);
    }

    public function downloadArticle(Request $request) {
        $request->validate([
            'settings' => 'required',
            'queries' => 'required',
        ]);

        $settings = $request->settings;
        $queries = $request->queries;

        $i = 0;
        foreach ($queries as $query) {
            $articles = $this->doajService->downloadArticle(
                $query["query"],
                $settings["pageSize"],
                $settings["pageAmount"],
                $settings["pageStart"],
            );
            $i++;
        }

        return response()->json([
            "settings" => $settings,
            "queries" => $queries,
            "message" => "Successfully Processing the Download. You can close the page now {$i}"
        ]);
    }
}
