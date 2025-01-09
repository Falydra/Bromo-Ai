<?php


namespace App\Http\Controllers\Ai;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\Process\Process;

class ChatController extends Controller
{
    public function askQuestion(Request $request)
    {
       
        $request->validate([
            'question' => 'required|string',
        ]);

        $question = $request->input('question');

        
        $process = new Process(['python', base_path('scripts/model.py'), $question]);
        $process->run();

     
        if (!$process->isSuccessful()) {
          
            logger()->error('Python script failed', ['error' => $process->getErrorOutput()]);
            return response()->json(['error' => 'Failed to execute Python script'], 500);
        }

        
        $output = $process->getOutput();

        return response()->json(['response' => $output]);
    }
}
