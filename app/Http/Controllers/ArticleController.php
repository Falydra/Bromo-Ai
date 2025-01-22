<?php

namespace App\Http\Controllers;

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

        $articles = $this->doajService->searchArticle($query, 10, 1, 1);

        if ($articles) {
            return $articles;
        }

        return response()->json([
            'error' => 'articles not found',
        ], 404);
    }

    public function downloadArticle(Request $request) {
        $request->validate([
            'articleData' => 'required|json',
        ]);

        $articleData = $request->articleData;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("{$this->pythonServer}/download", [
                "articleData" => $articleData,
            ]);

            $responseData = $response->json();

            return response()->json([
                'success' => true,
                'message' => 'Successfully downloaded articles',
                'data' => $responseData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e
            ]);
        }

        return response()->json([
            "error" => "500 Internal Server Error",
        ]);
    }
}
