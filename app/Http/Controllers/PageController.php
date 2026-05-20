<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Show the landing page.
     */
    public function landing()
    {
        return Inertia::render('landing/page');
    }

    /**
     * Show the welcome page.
     */
    public function welcome()
    {
        return Inertia::render('welcome');
    }
}
