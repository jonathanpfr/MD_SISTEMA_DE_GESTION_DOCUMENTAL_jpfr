import { FuseNavigationItem } from '@fuse/components/navigation';

export const navigation: FuseNavigationItem[] = [  
  {
    title: 'Usuario',
    type: 'group', // Para classy cambiar a group
    // icon: 'heroicons_outline:user',
    children: [
      {
        title: 'Perfiles de usuario por sede',
        type: 'basic',
        // link: '/',
      }
    ]
  },
  {    
    title: 'Proveedor',
    type: 'group',
    // icon: 'heroicons_outline:users',
    children: [
      {      
        title: 'Local',
        type: 'collapsable',
        children: [
          {
            title: 'Datos Generales',
            type: 'basic',
            link: '/proveedor/datos-generales'
          },
          {
            title: 'Datos Financieros',
            type: 'basic',
            link: '/proveedor/datos-financieros'
          },
          {
            title: 'Datos Producto',
            type: 'basic',
            link: '/proveedor/datos-producto'
          },
        ]
      },
      {
        title: 'Nacional',
        type: 'collapsable',
        children: [
          {
            title: 'Datos Generales',
            type: 'basic'
          },
          {
            title: 'Datos Financieros',
            type: 'basic'
          },
          {
            title: 'Datos Producto',
            type: 'basic'
          },
        ]
      },
      {        
        title: 'Internacional',
        type: 'collapsable',
        children: [
          {
            title: 'Datos Generales',
            type: 'basic'
          },
          {
            title: 'Datos Financieros',
            type: 'basic'
          },
          {
            title: 'Datos Producto',
            type: 'basic'
          },
        ]
      },
    ]
  },
  {
    title: 'Calendario',
    type: 'group',
    // icon: 'heroicons_outline:calendar',
    children: [
      {
        title: 'Días no laborables',
        type: 'basic'
      }
    ]
  },
  {
    title: 'Dashboard',
    type: 'group',
    // icon: 'heroicons_outline:chart-pie',
    children: [
      {
        title: 'Estadísticas en tiempo real',
        type: 'basic'
      }
    ]
  },
  {
    title: 'Auditoría',
    type: 'group',
    // icon: 'heroicons_outline:shield-check',
    children: [
      {
        title: 'Logs de usuarios en el sistema',
        type: 'basic'
      }
    ]
  },
];