describe("Ang test application", function () {


    beforeEach(module('angTest'));


    // Loads the controllers
    beforeEach(inject(function ($controller) {
        //scope = {};
        mainController = $controller('mainController', {});
    }));

    it("should define maincontroller", inject(function () {
        expect(mainController).toBeDefined();
    }));
    it('should have model defined and testController.model.name is equal to controllerAs vm test', function() {

        expect(mainController.list).toBeDefined();
        expect(mainController.list[0].ime).toEqual("math");
    });
    it('should not have a property called vm', function() {
        expect(mainController.vm).toBeUndefined();
    });
    it('some test', function(){
        expect(mainController.list.length).toEqual(2);
    });





});