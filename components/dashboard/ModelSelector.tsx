import React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const MODELS = [
  { provider: 'OpenRouter', name: 'anthropic/claude-2' },
  { provider: 'OpenAI', name: 'gpt-4-turbo' },
  { provider: 'DeepSeek', name: 'deepseek-chat' }
];

export default function ModelSelector() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
        Select AI Model
        <ChevronDownIcon className="h-4 w-4" />
      </Dropdown.Trigger>
      
      <Dropdown.Portal>
        <Dropdown.Content 
          className="min-w-[240px] bg-white rounded-lg shadow-lg border border-gray-200 p-2"
          sideOffset={5}
        >
          <Dropdown.Label className="px-2 py-1 text-xs text-gray-500">
            Popular Models
          </Dropdown.Label>
          
          {MODELS.map((model) => (
            <Dropdown.Item
              key={`${model.provider}-${model.name}`}
              className="flex flex-col px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 outline-none"
            >
              <span className="font-medium">{model.provider}</span>
              <span className="text-gray-500">{model.name}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
