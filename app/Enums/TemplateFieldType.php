<?php

namespace App\Enums;

enum TemplateFieldType: string
{
    case TEXT = 'TEXT';
    case TEXTAREA = 'TEXTAREA';
    case NUMBER = 'NUMBER';
    case DATE = 'DATE';
    case CHECKBOX = 'CHECKBOX';
    case DROPDOWN = 'DROPDOWN';
    case FILE = 'FILE';

    public function label(): string
    {
        return match($this) {
            self::TEXT => 'Text',
            self::TEXTAREA => 'Textarea',
            self::NUMBER => 'Number',
            self::DATE => 'Date',
            self::CHECKBOX => 'Checkbox',
            self::DROPDOWN => 'Dropdown',
            self::FILE => 'File',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
