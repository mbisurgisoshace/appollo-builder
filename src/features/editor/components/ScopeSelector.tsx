import { useParams } from "next/navigation";
import { MultiSelect } from "@/components/ui/multiselect";
import { useSuspenseScopeFeatures } from "../hooks/useEditor";

interface ScopeSelectorProps {
  value: string | undefined;
  onChange: (next: string) => void;
}

export const ScopeSelector = ({ value, onChange }: ScopeSelectorProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: scopeFeatures } = useSuspenseScopeFeatures(projectId);

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      emptySearchLabel="No scope found"
      options={scopeFeatures.map((t) => ({ label: t.slug!, value: t.slug! }))}
    />
  );
};
