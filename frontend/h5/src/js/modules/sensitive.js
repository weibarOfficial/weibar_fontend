App.SensitiveModule = (function () {
    var list = ['江泽民', '枪支弹药', '我操'];
    return {
        valide: function (val) {
            var flag = true;
            $.each(list, function (i, item) {
                if (val && val.indexOf(item) !== -1) {
                    flag = false;
                    return flag;
                }
            });
            return flag;
        },
        filter: function (val) {
            list.forEach(function (text) {
                if (val) {
                    val = val.replace(new RegExp(text, 'gi'), '*');
                }
            });
            return val;
        }
    }
})();
export default App.SensitiveModule;