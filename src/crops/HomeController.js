(function(){

  angular
       .module('users')
       .controller('HomeController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$window',
          'uiGmapGoogleMapApi',
          HomeController
       ]);


  /**
   * Home Controller
   * @constructor
   */
  function HomeController( userService, $mdSidenav, $mdBottomSheet, $log, $q, $scope, $window, uiGmapGoogleMapApi) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.share        = share;

  //if user is not logged in
  $window.navigator.geolocation.getCurrentPosition(function(position) {
      $scope.$apply(function() {
        $scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 14 };
          //$scope.accuracy = position.coords.accuracy;
      });
      }, function(error) {
          alert(error);
  });

  //set to burgas for testing on pc
  //$scope.map = { center: { latitude: 42, longitude: 27 }, zoom: 8 };


    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
      self.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    function share($event) {
        var user = self.selected;

        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: '/src/crops/view/home.html',
          controller: [ '$mdBottomSheet', UserSheetController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function UserSheetController( $mdBottomSheet ) {
          this.user = user;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();
