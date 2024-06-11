// Remove { Dict, Query } if not using TypeScript
import mixpanel, { Dict } from "mixpanel-browser"

function getMixpanelUrl() {
  if (import.meta.env.PROD) {
    return "https://www.dataos.so/mp"
  }
  return "http://localhost:3000/mp"
}

// https://dev.to/rain2o/using-mixpanel-via-proxy-with-nextjs-rewrites-130e?comments_sort=top
mixpanel.init("c3ccb32f164e2539cfe3d743876efa97", {
  // Use your project's URL, adding a slug for all Mixpanel requests
  api_host: getMixpanelUrl(),
  // debug: true,
  persistence: "localStorage",
})

const Mixpanel = {
  identify: (id: string) => {
    mixpanel.identify(id)
  },
  // alias: (id: string) => {
  //   mixpanel.alias(id);
  // },
  track: (name: string, props?: Dict) => {
    mixpanel.track(name, props)
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set(props)
    },
  },
}

export default Mixpanel
