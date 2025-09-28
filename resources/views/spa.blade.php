<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>{{ config('app.name', 'Ticketing System') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @vite(['resources/css/app.css', 'resources/js/ticket-app.jsx'])
        <!-- Dev-only shim: define minimal react-refresh globals early so Vite-injected module preambles
             that check for window.$RefreshReg$ / window.$RefreshSig$ don't immediately throw
             if the dev client hasn't initialized yet. This is a safe no-op in production. -->
        @if (app()->environment('local') || app()->environment('development'))
            <script>
                // No-op placeholders for React Refresh registration helpers.
                // Vite's react plugin expects these to exist during module evaluation in dev.
                if (typeof window !== 'undefined') {
                    if (typeof window.$RefreshReg$ === 'undefined') {
                        window.$RefreshReg$ = function() { /* noop for dev */ };
                    }
                    if (typeof window.$RefreshSig$ === 'undefined') {
                        window.$RefreshSig$ = function() {
                            return function(type) { return type; };
                        };
                    }
                }
            </script>
        @endif
    </head>
    <body>
        <div id="ticket-app"></div>
    </body>
</html>
