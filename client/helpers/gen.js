import moment from 'moment';

export class Gen {
    static objectCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static round(num) {
        return Math.round(num);
    }

    static getTimeFromISODate(date) {
        return moment(date).format("hh:mm");
    }

    static getDateFromISODate(date) {
        return moment(date).format("YYYY-MM-DD");
    }

    static getDayFromISODate(date) {
        return date ? Gen.getDayFromNumber(moment(date).day()) : Gen.getDayFromNumber(moment().day());
    }

    static isUserAdmin(user) {
        return user && user.role && (user.role === 'ADMIN');
    }

    static isUserManager(user) {
        return user && user.role && (user.role === 'MANAGER');
    }

    static isUserManagerOrAdmin(user) {
        return user && user.role && (user.role === 'MANAGER' || user.role === 'ADMIN');
    }

    static baseName(str) {
        let base = new String(str).substring(str.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") !== -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    }

    static mergeArray(a1, a2) {
        const newArray = Gen.objectCopy(a1);
        a2.map(item => {
            if(newArray.indexOf(item)<0) {
                newArray.push(item);
            }
        });
        return newArray;
    }

    static getCurrentTimeinRestaurant(restaurant) {
        return moment.utc().add(restaurant, 'minutes').format('YY-MM-DD HH:mm:ss');
    }

    static isValidRating(value) {
        if(Number(value) ){
            const rating = Number(value);
            if(rating >=0 && rating<=5) {
                return true;
            }
        }
        return false;
    }


    static getMonthFromNumber(month) {
        switch(month) {
            case "01":
                return "Jan";
            case "02":
                return "Feb";
            case "03":
                return "Mar";
            case "04":
                return "Apr";
            case "05":
                return "May";
            case "06":
                return "June";
            case "07":
                return "July";
            case "08":
                return "Aug";
            case "09":
                return "Sep";
            case "10":
                return "Oct";
            case "11":
                return "Nov";
            case "12":
                return "Dec";
            default:
                return "-"
        }
    }

    static getDayFromNumber(day) {
        switch(day) {
            case "1":
                return "Mondday";
            case "2":
                return "Tuesday";
            case "3":
                return "Wednesday";
            case "4":
                return "Thursday";
            case "5":
                return "Friday";
            case "6":
                return "Saturday";
            case "7":
                return "Sunday";
            default:
                return "Monday"
        }
    }
}
