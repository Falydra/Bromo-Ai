<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class DOAJService {
    protected $baseUrl;
    protected $apiKey;
    protected $outputPath;

    public function __construct() {
        $this->baseUrl = env('DOAJ_API_URL');
        $this->apiKey = env('DOAJ_API_KEY');
        // $this->outputPath = 'app/temp'; // for permanent storage, use 'app/json'
        $this->outputPath = 'scripts';
    }

}
