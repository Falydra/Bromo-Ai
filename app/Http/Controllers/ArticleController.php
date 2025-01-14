<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DOAJService;
use Symfony\Component\Process\Process;

class ArticleController extends Controller {
    protected $doajService;
    protected $pythonPath;

    public function __construct(DOAJService $doajService) {
        $this->doajService = $doajService;
        $this->pythonPath = base_path('scripts/venv/Scripts/python.exe');
    }

    public function searchArticle(Request $request) {
        $query = $request->input('query');

        $articles = $this->doajService->searchArticle($query);

        if ($articles) {
            return response()->json($articles);
        }

        return response()->json([
            'error' => 'articles not found',
        ], 404);
    }

    public function downloadArticle(Request $request) {
        $scriptPath = base_path('scripts/download_article.py');
        $process = new Process([$this->pythonPath, $scriptPath]);
        $process->run();

        if (!$process->isSuccessful()) {
            return response()->json(['error' => $process->getErrorOutput()], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Successfully downloaded articles',
        ], 200);
    }
}
