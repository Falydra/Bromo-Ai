<?php


namespace App\Http\Controllers\Ai;

use Illuminate\Http\Request;
use App\Services\DOAJService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;

class ChatController extends Controller {
    public function askQuestion(Request $request) {
        set_time_limit(60);
        // Validate the incoming request
        $request->validate([
            'question' => 'required|string',
        ]);

        $question = $request->input('question');

        try {
            $scriptPath = base_path('scripts/model.py');
            $pythonPath = base_path('scripts/venv/Scripts/python.exe');
            $process = new Process([$pythonPath, $scriptPath, escapeshellarg($question)]);
            $process->setWorkingDirectory(base_path('scripts'));
            $process->run();

            if (!$process->isSuccessful()) {
                return response()->json(['error' => $process->getErrorOutput()], 500);
            }

            $output = $process->getOutput();

            return response()->json(['response' => $output]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
