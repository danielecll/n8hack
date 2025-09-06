import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { UsageState } from '@/Interface';
import { useSettingsStore } from '@/stores/settings.store';

const ENTERPRISE_PLAN_NAME = 'Enterprise';

const ENTERPRISE_STATE: UsageState = {
	loading: false,
	data: {
		usage: {
			activeWorkflowTriggers: {
				limit: -1, // unlimited
				value: 0,
				warningThreshold: 1,
			},
			workflowsHavingEvaluations: {
				value: 0,
				limit: -1,
			},
		},
		license: {
			planId: 'enterprise',
			planName: ENTERPRISE_PLAN_NAME,
		},
	},
};

export const useUsageStore = defineStore('usage', () => {
	const settingsStore = useSettingsStore();

	const state = reactive<UsageState>({ ...ENTERPRISE_STATE });

	const planName = computed(() => ENTERPRISE_PLAN_NAME);
	const planId = computed(() => 'enterprise');
	const activeWorkflowTriggersLimit = computed(() => -1);
	const activeWorkflowTriggersCount = computed(() => state.data.usage.activeWorkflowTriggers.value);
	const workflowsWithEvaluationsLimit = computed(() => -1);
	const workflowsWithEvaluationsCount = computed(() => state.data.usage.workflowsHavingEvaluations.value);

	const executionPercentage = computed(() => 0);
	const instanceId = computed(() => settingsStore.settings.instanceId);
	const managementToken = computed(() => 'enterprise-token');
	const appVersion = computed(() => settingsStore.settings.versionCli);

	const subscriptionAppUrl = computed(() =>
		settingsStore.settings.license.environment === 'production'
			? 'https://subscription.n8n.io'
			: 'https://staging-subscription.n8n.io',
	);

	const commonSubscriptionAppUrlQueryParams = computed(
		() => `instanceid=${instanceId.value}&version=${appVersion.value}`,
	);

	return {
		planName,
		planId,
		activeWorkflowTriggersLimit,
		activeWorkflowTriggersCount,
		workflowsWithEvaluationsLimit,
		workflowsWithEvaluationsCount,
		executionPercentage,
		instanceId,
		managementToken,
		appVersion,
		isCloseToLimit: computed(() => false),
		viewPlansUrl: computed(
			() => `${subscriptionAppUrl.value}?${commonSubscriptionAppUrlQueryParams.value}`,
		),
		managePlanUrl: computed(
			() =>
				`${subscriptionAppUrl.value}/manage?token=${managementToken.value}&${commonSubscriptionAppUrlQueryParams.value}`,
		),
		isLoading: computed(() => state.loading),
		telemetryPayload: computed(() => ({
			instance_id: instanceId.value,
			action: 'view_plans',
			plan_name_current: ENTERPRISE_PLAN_NAME,
			usage: 0,
			quota: -1,
		})),
	};
});
