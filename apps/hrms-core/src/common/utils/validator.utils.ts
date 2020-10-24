export class ValidatorUtils {
    static isValidId(objectId: string): boolean {
        return objectId?.match(/^[0-9a-fA-F]{24}$/) != null;
    }
}
