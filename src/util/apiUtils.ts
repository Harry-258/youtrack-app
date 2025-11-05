import {EmbeddableWidgetAPI, HostAPI} from "../../@types/globals";
import {CustomFieldNameAndId} from "./@types.ts";

export async function getFieldDefaultValue(fieldID: string, host: HostAPI | EmbeddableWidgetAPI): Promise<string> {
    try {
        const result = await host.fetchYouTrack<{id: string, defaultValue: string}>(`admin/customFieldSettings/customFields/${fieldID}?fields=id,defaultValue`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // TODO: Get user default value. It should also be created in the first place.
        console.log(`Field default value is: ${JSON.stringify(result)}`);

        return result.defaultValue;
    } catch (error) {
        console.error(`Error checking if field exists: ${JSON.stringify(error)}`);
        return "";
    }
}

/**
 * Checks if a custom field with the given name exists in YouTrack
 * @param fieldName The name of the field to check
 * @param host The YouTrack instance to check against
 * @returns The ID of the field if it exists, or null if it doesn't
 */
export async function getFieldID(fieldName: string, host: HostAPI | EmbeddableWidgetAPI): Promise<string | null> {
    const customFields = await getFieldNamesAndIDs(host);
    for (const field of customFields) {
        if (field.name === fieldName) {
            return field.id;
        }
    }
    return null;
}

export async function getFieldNamesAndIDs(host: HostAPI | EmbeddableWidgetAPI): Promise<CustomFieldNameAndId[]> {
    try {
        return await host.fetchYouTrack<CustomFieldNameAndId[]>('admin/customFieldSettings/customFields?fields=name,id');
    } catch (error) {
        console.error(`Error getting all fields: ${JSON.stringify(error)}`);
        return [];
    }
}

export async function createField(fieldName: string, host: HostAPI | EmbeddableWidgetAPI, value: string): Promise<string> {
    try {
        const response = await host.fetchYouTrack<{ id: string }>('admin/customFieldSettings/customFields', {
            method: 'POST',
            body: {
                name: fieldName,
                isAutoAttached: false,
                isDisplayedInIssueList: false,
                fieldType: {
                    id: "string"
                },
                isPublic: false,
                defaultValue: value,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Created a field; response is: ${JSON.stringify(response)}`);
        return response.id;
    } catch (error) {
        console.error(`Error creating field: ${JSON.stringify(error)}`);
        // TODO: Handle this
        return "";
    }
}

export async function updateFieldValue(fieldID: string, host: HostAPI | EmbeddableWidgetAPI, newValue: string): Promise<string> {
    try {
        const response = await host.fetchYouTrack<{ flag: boolean }>(`admin/customFieldSettings/customFields/${fieldID}?fields=name,id,value`, {
            method: 'POST',
            body: {
                defaultValue: newValue,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Updated field to ${"a"} | response is: ${JSON.stringify(response)}`);
        return "true";
    } catch (error) {
        console.error(`Error updating field value: ${JSON.stringify(error)}`);
        return "false";
    }
}