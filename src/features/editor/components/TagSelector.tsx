import { MultiSelect } from "@/components/ui/multiselect";
import { useCreateTag, useSuspenseTags } from "../hooks/useTags";

interface TagSelectorProps {
  value: string | undefined;
  onChange: (next: string) => void;
}

export const TagSelector = ({ value, onChange }: TagSelectorProps) => {
  const { data: tags } = useSuspenseTags();
  const createTag = useCreateTag();

  const onCreateOption = (opt: { label: string; value: string }) => {
    createTag.mutate(
      { name: opt.value },
      {
        onError: (error) => {},
        onSuccess: (data) => {},
      },
    );
  };

  return (
    <MultiSelect
      creatable
      value={value}
      onChange={onChange}
      onCreateOption={onCreateOption}
      emptySearchLabel="No tags found"
      options={tags.map((t) => ({ label: t.name, value: t.name }))}
    />
  );
};
