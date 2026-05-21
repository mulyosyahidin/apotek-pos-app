<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        if (\Auth::check()) {
            return redirect()
                ->route('dashboard');
        }

        return Inertia::render('Auth/Login');
    }
}
