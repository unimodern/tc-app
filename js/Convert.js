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

        func.options['find'] = ' ';
        func.options['replace'] = '.';
        func.options['modifiers'] = ['u', 'm', 'g'];
        data = func.apply(data);

        func.options['find'] = '\\.+';
        func.options['replace'] = '.';
        func.options['modifiers'] = ['u', 'm', 'g'];
        data = func.apply(data);

        console.log(data.data)
        this.dotcase = data.data[0];
        this.dotcase_stats = func.stats(this.dotcase);
        this.results.push({
            'conversion': 'dotcase',
            'result': this.dotcase,
            'stats': this.dotcase_stats,
        });

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

        func.options['find'] = ' ';
        func.options['replace'] = '_';
        func.options['modifiers'] = ['u', 'm', 'g'];
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

		func.name='apply word';
		func.options['set/clear']='clear';
		func.options['words']=this.titlecase_exceptions;
		func.inputs = data;
		data = func.apply(data);
		
		
		func.name='apply element';
		func.options['set/clear']='set';
		func.options['positions']=['first','last'];
		func.inputs = data;
		data = func.apply(data);
		
		func.name='apply word case sensitive';
		func.options['set/clear']='clear';
		func.options['words']=this.titlecase_keep_exceptions;
		func.inputs = data;
		data = func.apply(data);
		
		
		func.name='first letter uppercase';
		func.inputs = data;
		data = func.apply(data);
		
		func.name='dim down';
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

    convert(conversion = null) {
        switch (conversion) {
            case "snakecase":
                this.snakecasefn();
                break;
            case "snakecase":
                this.dotcasefn();
                break;
            default:
                this.dotcasefn();
                this.snakecasefn();
                this.titlecasefn();
        }
        this.converted = true;
        return this.results;
    }

}
module.exports = Convert 