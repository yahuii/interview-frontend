import "./index.css";
import { useRouter } from "next/navigation";
import Input from "antd/lib/input";

interface Props {
  tagList?: string[];
}

/**
 * 搜索条
 * @constructor
 */
const SearchInput = () => {
  const router = useRouter();

  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: "flex",
        alignItems: "center",
        marginInlineEnd: 24,
      }}
    >
      <Input.Search
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
        }}
        placeholder="搜索题目"
        onSearch={(value) => {
          router.push(`/questions?q=${value}`);
        }}
      />
    </div>
  );
};

export default SearchInput;
