
    /* eslint-disable */
    /* tslint:disable */
     
    import {assignImportedComponents} from 'react-imported-component';
    
    const applicationImports = [
      () => import('./typescript/redux/components/areas/AreaLayoutOverview'),
      () => import(/* webpackChunkName: "Crags" */'./typescript/redux/components/crags/SplitRoute'),
    ];
    
    assignImportedComponents(applicationImports);
    export default applicationImports;