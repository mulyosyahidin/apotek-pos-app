import {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import {Input} from "@/Components/Catalyst/input.jsx";

const SupplierSelect = forwardRef(({value, onChange}, ref) => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const isManualSelect = useRef(false);

    useImperativeHandle(ref, () => ({
        reset() {
            setQuery("");
            onChange("");
        }
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
                const response = await fetch(route('api.suppliers.search', {search: query}));
                const data = await response.json();

                setOptions(data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error fetching data:", error);
                setOptions([]);
            }
            setLoading(false);
        };

        const delayDebounce = setTimeout(fetchData, 500);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleSelect = (item) => {
        isManualSelect.current = true;

        setQuery(item.name);
        onChange(item.id);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="Cari Supplier..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
            />

            {loading && <div className="absolute right-2 top-2 text-gray-500">Loading...</div>}

            {showDropdown && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-auto z-50">
                    {options.length > 0 ? (
                        options.map((item) => (
                            <li
                                key={item.id}
                                className="p-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => handleSelect(item)}
                            >
                                {item.name}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">Tidak ada hasil</li>
                    )}
                </ul>
            )}
        </div>
    );
});

export default SupplierSelect;
