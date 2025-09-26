<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TicketTemplate;
use App\Models\TicketTemplateField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;

class TicketTemplateController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', TicketTemplate::class);

        $templates = TicketTemplate::with(['category', 'fields'])
            ->when($request->has('active'), fn($q) => $q->where('is_active', $request->boolean('active')))
            ->when($request->has('category_id'), fn($q) => $q->where('category_id', $request->category_id))
            ->orderBy('name')
            ->get();

        return response()->json($templates);
    }

    public function store(Request $request)
    {
        Gate::authorize('create', TicketTemplate::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'category_id' => 'nullable|exists:ticket_categories,id',
            'fields' => 'array',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|in:TEXT,TEXTAREA,SELECT,RADIO,CHECKBOX,EMAIL,NUMBER,DATE,FILE',
            'fields.*.is_required' => 'boolean',
            'fields.*.options' => 'array',
            'fields.*.validation_rules' => 'nullable|string',
            'fields.*.order' => 'integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $template = TicketTemplate::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? '',
                'is_active' => $validated['is_active'] ?? true,
                'category_id' => $validated['category_id'] ?? null,
            ]);

            if (isset($validated['fields'])) {
                foreach ($validated['fields'] as $fieldData) {
                    TicketTemplateField::create([
                        'template_id' => $template->id,
                        'name' => $fieldData['name'],
                        'label' => $fieldData['label'],
                        'type' => $fieldData['type'],
                        'is_required' => $fieldData['is_required'] ?? false,
                        'options' => $fieldData['options'] ?? null,
                        'validation_rules' => $fieldData['validation_rules'] ?? null,
                        'order' => $fieldData['order'] ?? 0,
                    ]);
                }
            }

            DB::commit();

            return response()->json($template->load(['category', 'fields']), 201);
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function show(TicketTemplate $template)
    {
        Gate::authorize('view', $template);

        return response()->json($template->load(['category', 'fields']));
    }

    public function update(Request $request, TicketTemplate $template)
    {
        Gate::authorize('update', $template);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'is_active' => 'sometimes|boolean',
            'category_id' => 'sometimes|nullable|exists:ticket_categories,id',
            'fields' => 'sometimes|array',
            'fields.*.name' => 'required|string|max:255',
            'fields.*.label' => 'required|string|max:255',
            'fields.*.type' => 'required|in:TEXT,TEXTAREA,SELECT,RADIO,CHECKBOX,EMAIL,NUMBER,DATE,FILE',
            'fields.*.is_required' => 'boolean',
            'fields.*.options' => 'array',
            'fields.*.validation_rules' => 'nullable|string',
            'fields.*.order' => 'integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $template->update([
                'name' => $validated['name'] ?? $template->name,
                'description' => $validated['description'] ?? $template->description,
                'is_active' => $validated['is_active'] ?? $template->is_active,
                'category_id' => $validated['category_id'] ?? $template->category_id,
            ]);

            if (isset($validated['fields'])) {
                // Remove existing fields
                $template->fields()->delete();

                // Add new fields
                foreach ($validated['fields'] as $fieldData) {
                    TicketTemplateField::create([
                        'template_id' => $template->id,
                        'name' => $fieldData['name'],
                        'label' => $fieldData['label'],
                        'type' => $fieldData['type'],
                        'is_required' => $fieldData['is_required'] ?? false,
                        'options' => $fieldData['options'] ?? null,
                        'validation_rules' => $fieldData['validation_rules'] ?? null,
                        'order' => $fieldData['order'] ?? 0,
                    ]);
                }
            }

            DB::commit();

            return response()->json($template->fresh(['category', 'fields']));
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function destroy(TicketTemplate $template)
    {
        Gate::authorize('delete', $template);

        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }
}
