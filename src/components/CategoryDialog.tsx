
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTaskContext, Category } from '../context/TaskContext';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onOpenChange }) => {
  const { categories, addCategory, deleteCategory } = useTaskContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  // Lista de cores predefinidas para facilitar a seleção
  const predefinedColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#84cc16', // lime
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#d946ef', // fuchsia
    '#ec4899', // pink
  ];

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('O nome da categoria não pode estar vazio');
      return;
    }

    // Verificar se já existe uma categoria com este nome
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast.error('Já existe uma categoria com este nome');
      return;
    }

    addCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor
    });

    // Limpar o formulário
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id: string) => {
    // Verificar se é uma categoria padrão
    if (['work', 'personal', 'health', 'errands'].includes(id)) {
      toast.error('Não é possível excluir categorias padrão');
      return;
    }
    
    deleteCategory(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Gerenciar Categorias
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {/* Form to add new category */}
          <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <h3 className="text-sm font-medium">Nova Categoria</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da categoria"
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              
              <div className="relative">
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-10 h-10 rounded-md cursor-pointer"
                />
              </div>
              
              <Button 
                onClick={handleAddCategory}
                size="sm"
                className="h-10"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            
            {/* Color swatches */}
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    newCategoryColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>
          </div>
          
          {/* List of existing categories */}
          <div className="max-h-[300px] overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Categorias Existentes</h3>
            
            <ul className="space-y-2">
              {categories.map((category) => (
                <li 
                  key={category.id}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={['work', 'personal', 'health', 'errands'].includes(category.id)}
                    className={`p-1 h-7 w-7 ${['work', 'personal', 'health', 'errands'].includes(category.id) ? 'opacity-30 cursor-not-allowed' : ''}`}
                    aria-label={`Excluir categoria ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
