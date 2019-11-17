<?php
/**
 * Template part for displaying the AriaComponents help text.
 *
 * @package AriaComponents
 */

$ac_descriptions = [
	'top-level-help'  => __( 'Use left and right arrow keys to navigate between menu items.', 'ariacomponents' ),
	'submenu-help'    => __( 'Use right arrow key to move into submenus.', 'ariacomponents' ),
	'esc-help'        => __( 'Use escape to exit the menu.', 'ariacomponents' ),
	'submenu-explore' => __( 'Use up and down arrow keys to explore.', 'ariacomponents' ),
	'submenu-back'    => __( 'Use left arrow key to move back to the parent list.', 'ariacomponents' ),
];
?>

<?php if ( ! empty( $ac_descriptions ) ) : ?>
	<div class="screen-reader-only">
		<?php foreach ( $ac_descriptions as $ac_help_id => $ac_help_text ) : ?>
			<span id="<?php echo esc_attr( 'ac-describe-' . $ac_help_id ); ?>">
				<?php echo esc_html( $ac_help_text ); ?>
			</span>
		<?php endforeach; ?>
	</div>
<?php endif; ?>
