const Data = require("./Data.js");
const Func = require("./Func.js");
class Convert {
    constructor(form = null) {
        if (form) {
            this.text = form["ConvertForm[text]"];
        } else {
            this.text = form ? form.text : "";
        }
        this.string = this.text.replace('&#39;', "'");
        this.results = [];
        this.conversions = ['titlecase', 'aptcase', 'uppercase', 'lowercase'];
        this.trim = false;
        this.instant = false;
        this.nolinebreak = false;
        this.specific = false;
        this.converted = false;
        this.articles = "a,an,the";
        this.conjunctions = "and,or,but,nor,so for,yet,after,as,as if,as long as,even if,if,once,since,so that,that,till,until,what,when,also";
        this.propositions = "about,above,after,along,amid,among,anti,as,at,below,but,by,down,for,from,in,into,like,minus,near,of,off,on,onto,over,past,per,plus,round,save,since,than,to,under,until,up,upon,via,with";
        this.titlecase_keep_exceptions = ['YTD'];
        this.titlecase_keep_exceptions_all = { 'YTD': 'YTD' };
        this.titlecase_keep_exceptions_backup = 'YTD';
        this.titlecase_exceptions = ['a', 'abaft', 'about', 'above', 'afore', 'after', 'along', 'amid', 'among', 'an', 'apud', 'as', 'aside', 'at', 'atop', 'below', 'but', 'by', 'circa', 'down', 'for', 'from', 'given', 'in', 'into', 'lest', 'like', 'mid', 'midst', 'minus', 'near', 'next', 'of', 'off', 'on', 'onto', 'out', 'over', 'pace', 'past', 'per', 'plus', 'pro', 'qua', 'round', 'sans', 'save', 'since', 'than', 'thru', 'till', 'times', 'to', 'under', 'until', 'unto', 'up', 'upon', 'via', 'vice', 'with', 'worth', 'the', 'and', 'nor', 'or', 'yet', 'so'];
        this.titlecase_exceptions_all = { 'a': 'a', 'abaft': 'abaft', 'about': 'about', 'above': 'above', 'afore': 'afore', 'after': 'after', 'along': 'along', 'amid': 'amid', 'among': 'among', 'an': 'an', 'apud': 'apud', 'as': 'as', 'aside': 'aside', 'at': 'at', 'atop': 'atop', 'below': 'below', 'but': 'but', 'by': 'by', 'circa': 'circa', 'down': 'down', 'for': 'for', 'from': 'from', 'given': 'given', 'in': 'in', 'into': 'into', 'lest': 'lest', 'like': 'like', 'mid': 'mid', 'midst': 'midst', 'minus': 'minus', 'near': 'near', 'next': 'next', 'of': 'of', 'off': 'off', 'on': 'on', 'onto': 'onto', 'out': 'out', 'over': 'over', 'pace': 'pace', 'past': 'past', 'per': 'per', 'plus': 'plus', 'pro': 'pro', 'qua': 'qua', 'round': 'round', 'sans': 'sans', 'save': 'save', 'since': 'since', 'than': 'than', 'thru': 'thru', 'till': 'till', 'times': 'times', 'to': 'to', 'under': 'under', 'until': 'until', 'unto': 'unto', 'up': 'up', 'upon': 'upon', 'via': 'via', 'vice': 'vice', 'with': 'with', 'worth': 'worth', 'the': 'the', 'and': 'and', 'nor': 'nor', 'or': 'or', 'yet': 'yet', 'so': 'so' };
        this.titlecase_exceptions_backup = "a,abaft,about,above,afore,after,along,amid,among,an,apud,as,aside,at,atop,below,but,by,circa,down,for,from,given,in,into,lest,like,mid,midst,minus,near,next,of,off,on,onto,out,over,pace,past,per,plus,pro,qua,round,sans,save,since,than,thru,till,times,to,under,until,unto,up,upon,via,vice,with,worth,the,and,nor,or,yet,so";
        this.aptitlecase_exceptions = ['a', 'for', 'so', 'an', 'in', 'the', 'and', 'nor', 'to', 'at', 'of', 'up', 'but', 'on', 'yet', 'by', 'or'];
        this.aptitlecase_exceptions_all = { 'a': 'a', 'for': 'for', 'so': 'so', 'an': 'an', 'in': 'in', 'the': 'the', 'and': 'and', 'nor': 'nor', 'to': 'to', 'at': 'at', 'of': 'of', 'up': 'up', 'but': 'but', 'on': 'on', 'yet': 'yet', 'by': 'by', 'or': 'or' };
        this.aptitlecase_exceptions_backup = "a,for,so,an,in,the,and,nor,to,at,of,up,but,on,yet,by,or";
    }

    titlecasefn = () => {

        let data = new Data();
        data.data = [this.string]
        data.dim = 1

        let func = new Func()

        func.name = 'dim up';
        func.options['words'] = ['.', '!', '?', "\n", "\t", ':', ';'];
        func.inputs = data;
        data = func.apply(data);

        func.options['words'] = [' ', ',', '(', ')', '[', ']', '{', '}'];
        func.inputs = data;
        data = func.apply(data);

        func.name = 'apply word case sensitive';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.titlecase_keep_exceptions;
        func.inputs = data;
        data = func.apply(data);

        func.name = 'lowercase';
        func.inputs = data;
        data = func.apply(data);

        func.name = 'apply word';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.titlecase_exceptions;
        func.inputs = data;
        data = func.apply(data);


        func.name = 'apply element';
        func.options['set/clear'] = 'set';
        func.options['positions'] = ['first', 'last'];
        func.inputs = data;
        data = func.apply(data);

        func.name = 'apply word case sensitive';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.titlecase_keep_exceptions;
        func.inputs = data;
        data = func.apply(data);


        func.name = 'first letter uppercase';
        func.inputs = data;
        data = func.apply(data);

        func.name = 'dim down';
        func.inputs = data;
        data = func.apply(data);

        func.inputs = data;
        data = func.apply(data);

        console.log(data.data)
        this.titlecase = data.data[0];
        this.titlecase_stats = func.stats(this.titlecase);
        this.results.push({
            'conversion': 'titlecase',
            'result': this.titlecase,
            'stats': this.titlecase_stats,
        });
    }

    aptcasefn = () => {

        let data = new Data();
        data.data = [this.string]
        data.dim = 1

        let func = new Func()

        func.name = 'dim up';
        func.options['words'] = ['.', '!', '?', "\n", "\t", ':', ';'];
        func.inputs = data;
        data = func.apply(data);

        func.options['words'] = [' ', ',', '(', ')', '[', ']', '{', '}'];
        func.inputs = data;
        data = func.apply(data);

        func.name = 'apply word case sensitive';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.titlecase_keep_exceptions;
        func.inputs = data;
        data = func.apply(data);

        func.name = 'lowercase';
        func.inputs = data;
        data = func.apply(data);

        func.name = 'apply word';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.aptitlecase_exceptions;
        func.inputs = data;
        data = func.apply(data);


        func.name = 'apply element';
        func.options['set/clear'] = 'set';
        func.options['positions'] = ['first', 'last'];
        func.inputs = data;
        data = func.apply(data);

        func.name = 'apply word case sensitive';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.titlecase_keep_exceptions;
        func.inputs = data;
        data = func.apply(data);


        func.name = 'first letter uppercase';
        func.inputs = data;
        data = func.apply(data);

        func.name = 'dim down';
        func.inputs = data;
        data = func.apply(data);

        func.inputs = data;
        data = func.apply(data);

        console.log(data.data)
        this.aptcase = data.data[0];
        this.aptcase_stats = func.stats(this.aptcase);
        this.results.push({
            'conversion': 'aptcase',
            'result': this.aptcase,
            'stats': this.aptcase_stats,
        });
    }

    sentencecasefn = () => {

        const keep = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
            'United States of America', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua & Deps', 'Argentina',
            'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
            'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina',
            'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile',
            'People\'s Republic of China', 'Republic of China', 'Colombia', 'Comoros', 'Democratic Republic of the Congo',
            'Republic of the Congo', 'Costa Rica', ', Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Danzig', 'Denmark',
            'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
            'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gaza Strip', 'The Gambia', 'Georgia',
            'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
            'Holy Roman Empire', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Republic of Ireland',
            'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jonathanland', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
            'North Korea', 'South Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
            'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
            'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
            'Mongolia', 'Montenegro', 'Morocco', 'Mount Athos', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Newfoundland',
            'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Ottoman Empire', 'Pakistan',
            'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Prussia',
            'Qatar', 'Romania', 'Rome', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines',
            'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
            'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan',
            'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga',
            'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
            'United Kingdom', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
        ]

        let data = new Data();
        data.data = [this.string]
        data.dim = 1
        data = this.trimApply(data);

        let func = new Func()

        func.name = 'dim up';
        func.options['words'] = ['.', '!', '?', "\n", ':', ';'];
        func.inputs = data;
        data = func.apply(data);

        func.options['words'] = [' ', ',', '(', ')', '[', ']', '{', '}'];
        func.inputs = data;
        data = func.apply(data);
        console.log(data)
        
        func.name = 'apply word case sensitive';
        func.options['set/clear'] = 'clear';
        func.options['words'] = this.titlecase_keep_exceptions;
        func.inputs = [data];
        data = func.apply(data);
        
        func.name = 'lowercase';
        func.inputs = [data];
        data = func.apply(data);
        
        
        func.name = 'apply';
        func.options['set'] = false;
        func.inputs = [data];
        data = func.apply(data);
        
        func.name = 'apply word';
        func.options['set/clear'] = 'set';
        func.options['words'] = ['i'];
        func.inputs = [data];
        data = func.apply(data);
        
        func.name = 'uppercase';
        func.inputs = [data];
        data = func.apply(data);
        console.log(data,"uppercase")
        
        func.name = 'apply';
        func.options['set'] = true;
        func.inputs = [data];
        data = func.apply(data);

        func.name = 'ireplace';
        func.options['find'] = keep;
        func.options['replace'] = keep;
        func.inputs = data;
        data = func.apply(data);
        console.log(data,"here")

        func.name = 'apply';
        func.options['set'] = false;
        func.inputs = [data];
        data = func.apply(data);

        func.name = 'apply element';
        func.options['set/clear'] = 'set';
        func.options['positions'] = ['first'];
        func.inputs = data;
        data = func.apply(data);

        func.name = 'first letter uppercase';
        func.inputs = [data];
        data = func.apply(data);

        func.name = 'dim down';
        func.inputs = [data];
        data = func.apply(data);

        func.inputs = [data];
        data = func.apply(data);

        console.log(data)
        this.sentencecase = data.data[0];
        this.sentencecase_stats = func.stats(this.sentencecase);
        this.results.push({
            'conversion': 'sentencecase',
            'result': this.sentencecase,
            'stats': this.sentencecase_stats,
        });
    }

    dotcasefn = () => {

        let data = new Data();
        data.data = [this.string]
        data.dim = 1
        let func = new Func()
        func.name = 'lowercase';
        func.inputs = data;
        data = func.apply(data);

        func.name = 'regex';

        func.options['find'] = '(\\S)([^\\p{L}\\p{N}\\-\\r\\n$\\(\\{\\[\\)\\}\\]])';
        func.options['replace'] = '$1 $2';
        func.options['modifiers'] = ['u', 'm'];
        data = func.apply(data);

        func.options['find'] = '([^\\p{L}\\p{N}\\-\\r\\n\\(\\{\\[\\)\\}\\]])(\\S)';
        func.options['replace'] = '$1 $2';
        func.options['modifiers'] = ['u', 'm'];
        data = func.apply(data);

        func.options['modifiers'] = ['u'];
        func.options['find'] = '(\\s+$|^\\s+)';
        func.options['replace'] = '';
        data = func.apply(data);

        func.options['modifiers'] = ['u'];
        func.options['find'] = '( |_)+([^\\r\\n])';
        func.options['replace'] = ' $2';
        data = func.apply(data);

        func.options['find'] = '[\\s\\.\\,]';
        func.options['replace'] = '.';
        func.options['modifiers'] = ['m', 'g'];
        data = func.apply(data);

        func.options['find'] = '\\.+';
        func.options['replace'] = '.';
        func.options['modifiers'] = ['u', 'm', 'g'];
        data = func.apply(data);


        this.dotcase = data.data[0];
        this.dotcase_stats = func.stats(this.dotcase);
        this.results.push({
            'conversion': 'dotcase',
            'result': this.dotcase,
            'stats': this.dotcase_stats,
        });

    }

    trimApply = (data) => {
        const func = new Func;
        func.name = 'regex';
        func.options['modifiers'] = ['u'];
        func.options['find'] = '([\\p{L}\\.!?:;,])\\s( )+';
        func.options['replace'] = '$1 ';
        data = func.apply(data);

        func.options['modifiers'] = [];
        func.options['find'] = '\\s+([\\.\\!\\?,;:])';
        func.options['replace'] = '$1';
        data = func.apply(data);

        func.options['modifiers'] = ['u'];
        func.options['find'] = '([\\.!?,;:])(\\p{L})';
        func.options['replace'] = '$1 $2';
        data = func.apply(data);

        func.options['modifiers'] = [];
        func.options['find'] = '\\s*([\\(\\{\\[\\<])\\s*';
        func.options['replace'] = ' $1';
        data = func.apply(data);

        func.options['find'] = '\\s*([\\)\\}\\]\\>])\\s*';
        func.options['replace'] = '$1 ';
        data = func.apply(data);
        return data;
    }

    snakecasefn = () => {

        let data = new Data();
        data.data = [this.string]
        data.dim = 1
        let func = new Func()
        func.name = 'lowercase';
        func.inputs = data;
        data = func.apply(data);

        func.name = 'regex';

        func.options['find'] = '(\\S)([^\\p{L}\\p{N}\\-\\r\\n$\\(\\{\\[\\)\\}\\]])';
        func.options['replace'] = '$1 $2';
        func.options['modifiers'] = ['u', 'm'];
        data = func.apply(data);

        func.options['find'] = '([^\\p{L}\\p{N}\\-\\r\\n\\(\\{\\[\\)\\}\\]])(\\S)';
        func.options['replace'] = '$1 $2';
        func.options['modifiers'] = ['u', 'm'];
        data = func.apply(data);

        func.options['modifiers'] = ['u'];
        func.options['find'] = '(\\s+$|^\\s+)';
        func.options['replace'] = '';
        data = func.apply(data);

        func.options['modifiers'] = ['u'];
        func.options['find'] = '( |_)+([^\\r\\n])';
        func.options['replace'] = ' $2';
        data = func.apply(data);

        func.options['find'] = '[\\s\\.\\,]';
        func.options['replace'] = '_';
        func.options['modifiers'] = ['m', 'g'];
        data = func.apply(data);

        func.options['find'] = '_+';
        func.options['replace'] = '_';
        func.options['modifiers'] = ['u', 'm', 'g'];
        data = func.apply(data);

        console.log(data.data)
        this.snakecase = data.data[0];
        this.snakecase_stats = func.stats(this.snakecase);
        this.results.push({
            'conversion': 'snakecase',
            'result': this.snakecase,
            'stats': this.snakecase_stats,
        });
    }


    convert(conversion = null) {
        switch (conversion) {
            case "snakecase":
                this.snakecasefn();
                break;
            case "snakecase":
                this.dotcasefn();
                break;
            default:
                // console.log("titlecasefn")
                // this.titlecasefn();
                console.log("sentencecasefn")
                this.sentencecasefn();
                // console.log("aptcasefn")
                // this.aptcasefn();
                // console.log("snakecasefn")
                // this.snakecasefn();
                // console.log("dotcasefn")
                // this.dotcasefn();
        }
        this.converted = true;
        return this.results;
    }

}
module.exports = Convert 