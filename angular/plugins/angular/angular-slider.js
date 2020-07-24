define(['loginApp'], function(app){
	app.directive('slider', function () {
	    return {
	        restrict: 'A',
	        scope: {
	            ngModel: '='
	        },
	        link: function (scope, element, attrs) {
	            let label = $(element).find("#label");
	            let sliderWidth = label.width();
	            let borderWidth = parseInt(label.css("border-left-width")) + parseInt(label.css("border-right-width"));
	            let slider = new SliderUnlock("#"+attrs.id, {
	                successLabelTip: "验证成功"
	            }, function () {
	                scope.$apply(function () {
	                    scope.ngModel = (slider.index + borderWidth + sliderWidth == slider.max);
	                });
	            });
	            slider.init();
	        }
	    }
	});
})
