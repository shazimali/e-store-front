export default function canAccess({ next, router }) {

    // if (!localStorage.getItem('token')) {
    //     return router.push({ name: 'login' });
    //   }
    
      return next();
    }
