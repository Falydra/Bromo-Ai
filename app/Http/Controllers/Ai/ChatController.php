<?php


namespace App\Http\Controllers\Ai;

use Illuminate\Http\Request;
use App\Services\DOAJService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;

class ChatController extends Controller {
    protected $pythonServer;

    public function __construct() {
        $this->pythonServer = env('PYTHON_MODEL_URL');
    }

    public function askQuestion(Request $request) {
        // Validate the incoming request
        $request->validate([
            'question' => 'required|string',
        ]);

        $question = $request->input('question');

        try {
            $response = Http::withHeaders([
                "Content-Type" => "application/json",
            ])->post("{$this->pythonServer}/ask", [
                "query" => $question,
            ]);

            $responseData = $response->json();
            $time = $responseData["execution-time"];

            return response()->json([
                'resultSize' => count($responseData["response"]["results"]),
                'time' => "Execution Time: $time seconds",
                'response' => $responseData["response"],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
