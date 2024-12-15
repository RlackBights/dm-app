import { FaSearch } from "react-icons/fa"

interface searchBarProps {
    placeholder?: string;
    submit?: Function;
}

export interface searchBarValue {
    keys: string[];
    filters: {
        key: string;
        value: string;
    }[];
}

function processInput(str: string): searchBarValue
{
    const words = str.split(" ").filter(s => s !== '');
    const keys = words.filter(s => !s.match(/:[\S]*=[\S]*/g));
    const filters = words.filter(s => s.match(/:[\S]*=[\S]*/g)).map(f => ({ key: f.slice(1).split('=')[0], value: f.slice(1).split('=')[1] }));

    return {keys, filters}
}

export default function SearchBar({placeholder = "", submit = ((_: any) => {})} : searchBarProps)
{
    return (
        <form className='searchbar-wrapper' onSubmit={(e) => {
            e.preventDefault();
            submit(processInput(((e.target as HTMLFormElement).firstChild as HTMLInputElement).value));
        }}>
            <input type="text" name="character-search" placeholder={placeholder} />
            <button type="submit">
                <FaSearch />
            </button>
        </form>
    )
}