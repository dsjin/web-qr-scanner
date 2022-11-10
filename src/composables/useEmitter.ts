import { getCurrentInstance } from 'vue'
import { Emitter, EventType } from 'mitt'

export default function useEmitter () : Emitter<Record<EventType, unknown>> {
  const internalInstance = getCurrentInstance()
  const emitter = internalInstance?.appContext.config.globalProperties.emitter
  return emitter
}
