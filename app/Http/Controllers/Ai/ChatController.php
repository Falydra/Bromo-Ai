<?php


namespace App\Http\Controllers\Ai;

use Illuminate\Http\Request;
use App\Services\DOAJService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;

class ChatController extends Controller {
    protected $baseUrl;

    public function __construct() {
        $this->baseUrl = env('BROMO_MODEL_URL');
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
            ])->post("{$this->baseUrl}/ask", [
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

        // try {
        //     // $scriptPath = base_path('scripts/model.py');
        //     $scriptPath = base_path('scripts/test.py');
        //     $pythonPath = base_path('scripts/venv/Scripts/python.exe');
        //     $process = new Process([$pythonPath, $scriptPath, escapeshellarg($question)]);
        //     $process->setWorkingDirectory(base_path('scripts'));
        //     $process->run();

        //     if (!$process->isSuccessful()) {
        //         return response()->json(['error' => $process->getErrorOutput()], 500);
        //     }

        //     $output = $process->getOutput();

        //     return response()->json(['response' => $output]);
        // } catch (\Exception $e) {
        //     return response()->json(['error' => $e->getMessage()], 500);
        // }
    }
}
