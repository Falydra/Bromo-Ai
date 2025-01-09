<?php


namespace App\Http\Controllers\Ai;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\Process\Process;

class ChatController extends Controller
{
    public function askQuestion(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'question' => 'required|string',
        ]);

        $question = $request->input('question');

        // Define the process to run the Python script
        $process = new Process(['python', base_path('scripts/model.py'), $question]);
        $process->run();

        // Check if the process was successful
        if (!$process->isSuccessful()) {
            // Log the error (optional)
            logger()->error('Python script failed', ['error' => $process->getErrorOutput()]);
            return response()->json(['error' => 'Failed to execute Python script.'], 500);
        }

        // Get the output from the Python script
        $output = $process->getOutput();

        return response()->json(['response' => $output]);
    }
}
