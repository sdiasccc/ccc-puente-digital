import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import PageHeader from '@/components/shared/PageHeader';
import SearchFilter from '@/components/shared/SearchFilter';
import DocumentCard from '@/components/shared/DocumentCard';
import EmptyState from '@/components/shared/EmptyState';
import { FileText } from 'lucide-react';
import type { DocumentCategory } from '@/types';

const categoryOptions = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'nomina', label: 'Nómina' },
  { value: 'politica', label: 'Política' },
  { value: 'formacion', label: 'Formación' },
  { value: 'general', label: 'General' },
];

export default function DocumentosPage() {
  const { documents, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const accessible = documents.filter((d) => !d.archived && d.roles.includes(currentUser.role));

  const filtered = useMemo(() => {
    return accessible.filter((d) => {
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || d.category === category;
      return matchSearch && matchCategory;
    });
  }, [accessible, search, category]);

  return (
    <div className="space-y-6">
      <PageHeader title="Documentos" description="Biblioteca de documentos de la empresa" />

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar documentos..."
        filters={[
          {
            value: category,
            onChange: setCategory,
            options: categoryOptions,
            placeholder: 'Categoría',
          },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No se encontraron documentos"
          description="Intenta ajustar los filtros de búsqueda"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
