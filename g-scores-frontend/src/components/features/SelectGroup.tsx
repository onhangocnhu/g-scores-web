import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface Props {
  groupName: string;
  setGroupName: (value: string) => void;
}

export function SelectGroupSubject({ groupName, setGroupName }: Props) {
  return (
    <Select value={groupName} onValueChange={setGroupName}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a subject group" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Subject Groups</SelectLabel>

          <SelectItem value="natural">Natural Sciences</SelectItem>
          <SelectItem value="core">Core Subjects</SelectItem>
          <SelectItem value="social">Social Sciences</SelectItem>
          <SelectItem value="foreign">Foreign Language</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

