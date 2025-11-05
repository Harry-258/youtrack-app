import React, {memo, useCallback, useState, useEffect} from 'react';
import {YouTrackProject} from "../../util/@types.ts";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import {changeBackendFlagValue, fetchBackendFlag, fetchProjects} from "../../util/apiUtils.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>(true);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Passing the setProjects method because it's an asynchronous function,
        // and it can't await in the useEffect hook.
        fetchProjects(host, setProjects, setError, setLoading);
        fetchBackendFlag(host);
    }, []);

    const toggleBackendFlag = useCallback(async () => {
        const newFlagValue = !backendFlagValue;
        const confirmedValue = await changeBackendFlagValue(host, newFlagValue);

        if (confirmedValue !== null) {
            setBackendFlagValue(confirmedValue);
        } else {
            setError(true);
        }
    }, [backendFlagValue]);

  return (
    <div className="widget">
        <Toggle
            checked={backendFlagValue}
            onChange={toggleBackendFlag}
        >
            Switch backend flag
        </Toggle>
        {loading && <div>Loading projects...</div>}
        {error && <div>Error loading projects</div>}

        {projects.map((project, index) =>
            <span key={index}>{project.name}</span>
        )}
    </div>
  );
};

export const App = memo(AppComponent);
