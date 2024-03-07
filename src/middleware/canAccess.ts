export default function canAccess({ next, router }) {

  console.log('Can Access');
    // if (!localStorage.getItem('token')) {
    //     return router.push({ name: 'login' });
    //   }
    
      return next();
    }
