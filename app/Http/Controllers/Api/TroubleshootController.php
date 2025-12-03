<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TroubleshootDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;

class TroubleshootController extends Controller
{
    public function index()
    {
        $documents = TroubleshootDocument::where('is_active', true)
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'documents' => $documents
        ]);
    }

    public function store(Request $request)
    {
        // Only Super Admin can upload
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'file' => [
                    'required',
                    File::types(['pdf'])
                        ->min(1024) // 1KB minimum
                        ->max(100 * 1024), // 100MB maximum
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

        $file = $request->file('file');
        
        if (!$file) {
            return response()->json(['message' => 'No file uploaded'], 400);
        }

        $filename = Str::uuid() . '.pdf';
        $path = $file->storeAs('troubleshoot-documents', $filename, 'public');

        $document = TroubleshootDocument::create([
            'title' => $request->title,
            'description' => $request->description,
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Document uploaded successfully',
            'document' => $document->load('uploader')
        ], 201);
    }

    public function update(Request $request, TroubleshootDocument $document)
    {
        // Only Super Admin can update
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $document->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Document updated successfully',
            'document' => $document->fresh('uploader')
        ]);
    }

    public function destroy(Request $request, TroubleshootDocument $document)
    {
        // Only Super Admin can delete
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the file from storage
        $document->deleteFile();

        // Delete the database record
        $document->delete();

        return response()->json([
            'message' => 'Document deleted successfully'
        ]);
    }

    public function download(TroubleshootDocument $document)
    {
        if (!$document->is_active) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        // Check if file exists using Storage facade
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->original_filename);
    }

    public function view(TroubleshootDocument $document)
    {
        if (!$document->is_active) {
            return response()->json(['message' => 'Document not found'], 404);
        }

        // Check if file exists using Storage facade
        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $filePath = Storage::disk('public')->path($document->file_path);

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $document->original_filename . '"'
        ]);
    }
}
