import React, {memo, useCallback, useState, useEffect} from 'react';
import {YouTrackProject} from "../../util/@types.ts";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import {changeBackendFlagValue, fetchBackendFlag, fetchProjects} from "../../util/apiUtils.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>(true);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<YouTrackProject[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Passing the setProjects method because it's an asynchronous function,
        // and it can't await in the useEffect hook to not assign a Promise object.
        fetchProjects(host, setErrorMessage).then((result) => {
            setProjects(result);
            setFilteredProjects(result);
            setLoading(false);
        });
        fetchBackendFlag(host, setBackendFlagValue, setErrorMessage);
    }, []);

    const toggleBackendFlag = useCallback(async () => {
        await changeBackendFlagValue(host, !backendFlagValue, setErrorMessage);

        // Calls fetch as well to persist in case of multiple toggles happening at the same time
        await fetchBackendFlag(host, setBackendFlagValue, setErrorMessage);
    }, [backendFlagValue]);

    // TODO: Set error message in components
  return (
    <div className="widget">
        <div className="widget-header">
            <h1>Project Visualizer</h1>
            <p>Visualize your projects and save a boolean flag on the backend.</p>
        </div>

        <div className="widget-content">
            <h2>Projects</h2>
            <div className='widget-content-controls'>
                <div className='searchbar'>
                    <input
                        placeholder='Filter projects by name'
                        onChange={(e) => {
                            setFilteredProjects(
                                projects.filter(
                                    project => project.name.toLowerCase().includes(e.target.value)
                                )
                            );
                        }}
                        className='searchbar-input'
                    />
                </div>
                <Toggle
                    checked={backendFlagValue}
                    onChange={toggleBackendFlag}
                >
                    Toggle backend flag
                </Toggle>
            </div>
            {loading && <div>Loading projects...</div>}
            <div className='list'>
                {filteredProjects.length === 0 && !loading && <h3 style={{color: "var(--ring-border-disabled-color)"}}>No projects found</h3>}
                {filteredProjects.map((project, index) =>
                    <div key={project.id} className='list-element'>
                        <h3 style={{color: "var(--ring-grey-fill-color)"}} key={index}>{project.name}</h3>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export const App = memo(AppComponent);
