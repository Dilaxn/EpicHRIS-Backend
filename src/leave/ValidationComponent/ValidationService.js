class ValidationService {
    isValidDay(month, day) {
        let isValid;
        switch (month) {
            case 'January':
            case 'March':
            case 'May':
            case 'July':
            case 'August':
            case 'October':
            case 'December': {
                if (day >= 1 && day <= 31) {
                    isValid = true;
                }else {
                    isValid =  false;
                }
            }
            break;
            case'April':
            case 'June':
            case 'September':
            case 'November': {
                if (day >= 1 && day <= 30) {
                    isValid = true;
                }else {
                    isValid = false;
                }
            }
            break;
            case 'February': {
                if (day >= 1 && day <= 28) {
                    isValid = true;
                }else {
                    isValid = false;
                }
            }
            break;
            default:
                isValid =  false;
        }
        return isValid;
    }
}
module.exports = ValidationService;