import ManageLinks from "./general components/ManageLinks";
import Preview from "./general components/Preview";

export default function page() {
    return (
        <div className="flex sm:px-3 px-2 h-full overflow-y-hidden">
            <div className="flex-1 py-2 flex flex-col max-h-full overflow-y-auto">
                <ManageLinks />
            </div>
            <Preview />
        </div>
    );
}