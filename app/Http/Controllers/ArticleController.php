<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DOAJService;

class ArticleController extends Controller {
    protected $doajService;

    public function __construct(DOAJService $doajService) {
        $this->doajService = $doajService;
    }

    public function show($id) {
        $article = $this->doajService->getArticle($id);

        if ($article) {
            return response()->json($article);
        }

        return response()->json(['error' => 'articles not found'], 404);
    }

    public function search($search_query) {
        $articles = $this->doajService->searchArticle($search_query);

        if ($articles) {
            return response()->json($articles);
        }

        return response()->json(['message' => 'no articles found']);
    }
}
