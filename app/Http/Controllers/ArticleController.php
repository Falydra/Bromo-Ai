<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DOAJService;

class ArticleController extends Controller {
    protected $doajService;

    public function __construct(DOAJService $doajService) {
        $this->doajService = $doajService;
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
}
