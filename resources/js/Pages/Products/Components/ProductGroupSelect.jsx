import {
    useEffect,
    useState,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { Input } from '@/Components/Catalyst/input';

const ProductGroupSelect = forwardRef(({ value, onChange }, ref) => {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const isManualSelect = useRef(false);

    useImperativeHandle(ref, () => ({
        reset() {
            setQuery('');
            onChange('');
        },
    }));

    useEffect(() => {
        if (isManualSelect.current) {
            isManualSelect.current = false;
            return;
        }

        if (query.length < 2) {
            setOptions([]);
            setShowDropdown(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    route('api.product-groups.search', { search: query }),
                );
                const data = await response.json();

                setOptions(data);
                setShowDropdown(true);
            } catch (error) {
                console.error('Error fetching data:', error);
                setOptions([]);
            }
            setLoading(false);
        };

        const delayDebounce = setTimeout(fetchData, 500);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleSelect = (item) => {
        isManualSelect.current = true;

        setQuery(`${item.name} (${item.category})`);
        onChange(item.id);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="Cari Barang Utama..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
            />

            {loading && (
                <div className="absolute right-2 top-2 text-gray-500 dark:text-zinc-400">
                    Loading...
                </div>
            )}

            {showDropdown && (
                <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                    {options.length > 0 ? (
                        options.map((item) => (
                            <li
                                key={item.id}
                                className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-white/10"
                                onClick={() => handleSelect(item)}
                            >
                                {item.name} ({item.category})
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500 dark:text-zinc-400">
                            Tidak ada hasil
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
});

export default ProductGroupSelect;
