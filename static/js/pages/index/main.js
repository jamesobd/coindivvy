/**
 * Created by James on 12/29/13.
 */
$(function() {
    $('#address-search-btn').click(function(e) {
        e.preventDefault();
        window.location = e.target.form.action + '/' + $('[name=address]', e.target.form).val();
    });
});