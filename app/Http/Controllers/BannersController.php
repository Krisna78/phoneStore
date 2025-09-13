<?php

namespace App\Http\Controllers;

use App\Models\Banners;
use Illuminate\Http\Request;

class BannersController extends Controller
{
    public function index()
    {
        return response()->json(Banners::all());
    }
}
