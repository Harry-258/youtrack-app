import React, {memo, useCallback, useState, useEffect} from 'react';
import {YouTrackProject} from "../../util/@types.ts";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import {
    getFieldDefaultValue,
    createField,
    updateFieldValue,
    getFieldID
} from "../../util/apiUtils.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>(true);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [customFieldId, setCustomFieldId] = useState<string | null>(null);

    const customFieldName = "Backend flag";

    useEffect(() => {
        /**
         *
         */
        const fetchProjects = async () => {
            try {
                const requestResponse = await host.fetchYouTrack('admin/projects?fields=name');
                setProjects(requestResponse as YouTrackProject[]);
            } catch (error) {
                console.error(`Error fetching projects: ${error}`);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();

        /**
         *
         */
        const fetchBackendFlag = async () => {
            const fieldId = await getFieldID(customFieldName, host);
            if (fieldId === null) {
                setCustomFieldId(await createField(customFieldName, host, "false"));
                setBackendFlagValue(false);
            } else {
                setCustomFieldId(fieldId);
                const defaultValue = await getFieldDefaultValue(fieldId, host);
                console.log(`Default value is: ${defaultValue}`);
                setBackendFlagValue(defaultValue === "false");
            }
        }
        fetchBackendFlag();
    }, []);

    /**
     *
     */
    const toggleBackendFlag = useCallback(async () => {
        const newFlagValue = !backendFlagValue;
        // TODO: update flag. If it doesn't exist anymore, create it and save the new ID.

        // if (customFieldId !== null || await getFieldID(customFieldName, host)) {
        //     await updateFieldValue(customFieldName, host, newFlagValue.toString());
        // } else {
        //     await createField(customFieldName, host, newFlagValue.toString());
        // }
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
